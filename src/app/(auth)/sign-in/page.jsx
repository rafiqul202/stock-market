"use client";
import FooterLinks from "@/components/forms/FooterLinks";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/lib/action/auth.action";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignInPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) {
        router.push("/");
        toast.success("Sign-in sussfull");
      }
    } catch (error) {
      console.log(error);
      toast.error("some thing was wrong sign-up");
    }
  };
  return (
    <>
      <h1 className="form-title">Welcome back</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          placeholder="contact121@gmail.com"
          register={register}
          error={errors.email}
          validation={{
            required: "Email is required",
            pattern: /^\w+@\w+\.\w+$/,
          }}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: "Password is required", minLength: 8 }}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Signing In" : "Sign In"}
        </Button>
        <FooterLinks
          text="Don't have an account?"
          href={"/sign-up"}
          lineText="Create an account"
        />
      </form>
    </>
  );
};

export default SignInPage;
