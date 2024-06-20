"use client";

import { NextPage } from 'next'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react';

interface AddToCartButtonProps {}

export const AddToCartButton: NextPage<AddToCartButtonProps> = ({}) => {

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {setIsSuccess(false)}, 2000);

    return () => {
      clearTimeout(timeout)
    }
  }, [])



  return <Button size={'lg'} className='w-full' disabled={isSuccess} onClick={() => setIsSuccess(true)}>
    {isSuccess ? 'Added' : 'Add to Cart'}
  </Button>
}

