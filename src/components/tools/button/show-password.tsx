import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

export default function PasswordAdornment({ func, isLabelExist = false }: any) {
  const [isHover, setIsHover] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };
  const clickHandler = () => {
    func();
    setIsClicked(!isClicked);
  };

  return (
    <button
      className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
        isLabelExist && `mt-3`
      }`}
      type="button"
      style={{
        backgroundColor: "Transparent",
        border: 0,
        color: isHover ? "#1AA64A" : "",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={clickHandler}>
      {!isClicked ? <AiFillEye></AiFillEye> : <AiFillEyeInvisible></AiFillEyeInvisible>}
    </button>
  );
}
