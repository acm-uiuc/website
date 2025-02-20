'use client';
import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, useDisclosure } from '@nextui-org/react';
import Link from 'next/link';
import Transition from '@/components/Transition';

const MembershipOptions = () => {
  return (
    <>
      <div className="bg-acmdark min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl font-bold mb-8 text-center">
          Become a Member of ACM@UIUC
        </h1>

        <div className="max-w-6xl w-full flex flex-col p-6 md:flex-row gap-8 justify-center">
          <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center justify-center min-h-[300px]">
            <h2 className="text-2xl font-semibold mb-4">1. Join Discord</h2>
            <p className="mb-6">
              Connect with our community on Discord for real‑time discussions and updates.
            </p>
            <a
                className="flex flex-col w-full sm:w-fit px-16 py-3 items-center text-white text-center text-xl rounded-full bg-primary hover:bg-secondary transition-all"
                href="https://discord.gg/w8kX7YgD3F"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Discord
              </a>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center justify-center min-h-[300px]">
            <h2 className="text-2xl font-semibold mb-4">2. Become a Paid Member</h2>
            <p className="mb-6">
              Get more involved and support ACM by becoming a paid member. Enjoy exclusive benefits and member-only resources!
            </p>
            <a
                className="flex flex-col w-full sm:w-fit px-16 py-3 items-center text-white text-center text-xl rounded-full bg-primary hover:bg-secondary transition-all"
                href="/membership"
                target="_blank"
                rel="noopener noreferrer"
              >
                Become a Member
              </a>
          </div>

        </div>
      </div>
    </>
  );
};

export default MembershipOptions;
