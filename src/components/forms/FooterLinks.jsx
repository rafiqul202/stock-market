import Link from 'next/link'
import React from 'react'

const FooterLinks = ({text,href,lineText}) => {
  return (
    <div className='text-center mx-auto pt-4'>
      <p className='text-sm text-gray-500'>
        {text}
      </p>
      <Link href={href}>
      {lineText}
      </Link>
    </div>
  )
}

export default FooterLinks