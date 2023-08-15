'use client'

import styles from "./styles.module.css";


const Error = () => {
    return (
        <div className="relative flex gap-4 flex-col justify-center items-center aspect-square p-3 h-fit">
            <span className={styles.loader}></span>
            <label className="absolute flex animate-pulse text-xs font-normal text-[#ebc3b7ec] h-fit w-fit">
                Error...
            </label>
        </div>
    );
}
 
export default Error;
