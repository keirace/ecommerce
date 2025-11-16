'use client'
import { useState } from 'react'
import Image from 'next/image'

const CollapsibleColumn = ({ title, rightMeta, children }: { title: string; rightMeta?: React.ReactNode; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="border-b border-light-400 py-3 transition-transform duration-300">
      <div className="flex items-center justify-between w-full hover:cursor-pointer" onClick={toggle} aria-expanded={isOpen}>
        <h4 className="text-heading-3">{title}</h4>
        <span className="flex items-center gap-2">
          {rightMeta}
          <Image className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} src="/chevron-down.svg" alt="Arrow" width={16} height={16} />
        </span>
      </div>
      <div className={`flex flex-col justify-start space-y-3 mb-3 transition-all duration-300 overflow-hidden ${isOpen ? "max-h-fit" : "max-h-0"
        }`}>
        {children}
      </div>
    </div>
  );
}

export default CollapsibleColumn