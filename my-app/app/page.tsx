'use client';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [books, setBooks] = useState([
  { id: 100, name: 'java' },
  { id: 200, name: 'php' },
  { id: 300, name: 'C#' },
  { id: 400, name: 'python' }
])
  const [massage, setMassage] = React.useState('Hello');
  const [change, setChange] = useState('')
  const isFirst = useRef(true);
  const textBox = useRef<HTMLInputElement>(null);

  useEffect(() => {
    textBox.current?.focus();
  }, [])

  useEffect (() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
  

  console.log('massage = ', massage)
  setChange('massage change massage is ' + massage)
  }, [massage])

  useEffect(() => {
    if (massage !== '') {
      setChange('massage change massage is ' + massage)
    }
  }, [massage])
  return (
    <div>
      <div className="p-4">
        <div className="mt-10 mb-10">
          <img alt='my picture' src='/next.svg' width={200} height={200} />
        </div>
        <button className='button'>My Button</button>
        {books.map(item => (
        <div key={item.id}>
          {item.id} : {item.name}
        </div>
      ))}
      </div>
    </div>
  );
}
