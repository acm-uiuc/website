'use client';
import styles from './index.module.css';

export default function DevModePopup() {
    return (
      <div
        className={`hidden lg:flex flex-col fixed w-[120px] text-center text-base p-2 z-10 right-4 bg-surface-100 border-2 border-surface-150 rounded-2xl hover:shadow-2xl ${styles.popup}`}
        style={{top: "1rem", left: "1rem"}}
      >
        <b className="mb-2" style={{color: 'red', fontSize: '1.25em'}}>
          DEV MODE
        </b>
      </div>
    );
};