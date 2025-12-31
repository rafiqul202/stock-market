import { getNews } from "../action/finnhub.actions";
import { getAllUsersForNewsEmail } from "../action/user.action";
import { getWatchlistSymbolsByEmail } from "../action/watchlist.action";
import { sendNewsSummaryEmail } from "../nodemailer";
import { formatDateToday } from "../utils";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./promts";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    const userProfile = `
        - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
    `;
    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.repeat(
      "{{userProfile}}",
      userProfile
    );
    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.0-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {text:prompt}
            ]
          }
        ]
      }
    })
    await step.run("send-welcome-email", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText = (part && "text" in part ? part.text : null) || "Thanks for joining Signalist.You now have the tools to track market and make smarter moves"
      // !Email sending logic
      const { data: { email, name } } = event;
      return await sendSignUpEmail({email,name,intro:introText})
    })
    return {
      success: true,
      message: "Welcome email send successfully!"
    }
  }
);

export const sendDailyNewsSummery = inngest.createFunction(
  { id: "daily-news-summery" },
  [{ event: 'app/send.daily.news' }, { cron: '0 12 * * *' }],
  async ({ step }) => {
    // step-1 get all users for news delivery
    const users = await step.run('get-all-users', getAllUsersForNewsEmail);
    if(!users && users.email === 0) return {success:false,message:'No User Fount for News email'}
    // step-2 for each user, get watchlist symbols -> fetch news
    const results = step.run('fetch-user-news', async () => {
      let perUser = [];
      for (const user of users) {
        try {
          const symbol = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbol);
          // Enforce max 6 articles per user
          articles = (articles || []).slice(0, 6);
          // If still empty, fallback to general
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          perUser.push({ user, articles });
        } catch (error) {
          console.error("daily-news: error preparing user news", user.email, e);
          perUser.push({ user, articles: [] });
        }
      }
      return perUser
    })
    // step-3  summarize these news via ai for each user
    const userNewsSummaries = [];
    for (const { user, articles } of results) {
       try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{newsData}}",
          JSON.stringify(articles, null, 2)
        );
        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
          body: {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          },
        });
        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent =
          (part && "text" in part ? part.text : null) || "No market news.";
          userNewsSummaries.push({ user, newsContent });

       } catch (error) {
        console.error("Failed to summarize news for : ", user.email);
        userNewsSummaries.push({ user, newsContent: null });
       }
     }
    // step-4  Send Email
    await step.run('send-news-emails', async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;
          return await sendNewsSummaryEmail({email:user.email,date:formatDateToday(),newsContent})
        })
      )

    })
    return{success:true,message:"Daily new summery email send successfully"}

  }
)