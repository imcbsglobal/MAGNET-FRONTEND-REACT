import { FaGraduationCap, FaBook, FaPenFancy } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { RiMedalLine } from "react-icons/ri";
import { BsBackpack2Fill } from "react-icons/bs";
import { TbAbacus } from "react-icons/tb";
import { FaFlaskVial, FaComputer } from "react-icons/fa6";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { GiMicroscope } from "react-icons/gi";

const LoginIcons = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* Top Row */}
      <FaGraduationCap className="text-[#fb923c] text-4xl absolute top-4 left-[5%] opacity-40 rotate-[12deg]" />
      <TbAbacus className="text-[#fde047] text-5xl absolute top-6 left-1/3 opacity-40 rotate-[3deg]" />
      <FaFlaskVial className="text-[#fb923c] text-4xl absolute top-4 right-1/3 opacity-40 rotate-[6deg]" />
      <FaComputer className="text-[#fde047] text-5xl absolute top-6 right-[5%] opacity-40 -rotate-[8deg]" />

      {/* Left Side */}
      <GiMicroscope className="text-[#fde047] text-4xl absolute top-1/4 left-[2%] opacity-40 rotate-[6deg]" />
      <TbAbacus className="text-[#fb923c] text-4xl absolute top-[40%] left-[10%] opacity-40 rotate-[6deg]" />
      <BsBackpack2Fill className="text-[#fde047] text-5xl absolute top-1/2 left-[3%] opacity-40 rotate-[4deg]" />
      <FaPenFancy className="text-[#fb923c] text-4xl absolute bottom-1/4 left-[2%] opacity-40 rotate-[10deg]" />
      <FaComputer className="text-[#fde047] text-4xl absolute bottom-[20%] left-[10%] opacity-40 rotate-[10deg]" />

      {/* Right Side */}
      <MdSchool className="text-[#fb923c] text-5xl absolute top-1/4 right-[2%] opacity-40 rotate-[6deg]" />
      <TfiRulerAlt2 className="text-[#fde047] text-4xl absolute top-[40%] right-[10%] opacity-40 rotate-[2deg]" />
      <GiMicroscope className="text-[#fb923c] text-4xl absolute top-1/2 right-[3%] opacity-40 rotate-[6deg]" />
      <RiMedalLine className="text-[#fde047] text-5xl absolute bottom-1/4 right-[2%] opacity-40 rotate-[5deg]" />
      <FaBook className="text-[#fb923c] text-4xl absolute bottom-[20%] right-[10%] opacity-40 rotate-[3deg]" />

      {/* Bottom Row */}
      <FaBook className="text-[#fde047] text-4xl absolute bottom-4 left-[5%] opacity-40 rotate-[3deg]" />
      <RiMedalLine className="text-[#fde047] text-5xl absolute bottom-6 right-1/3 opacity-40 rotate-[5deg]" />
      <FaFlaskVial className="text-[#fb923c] text-4xl absolute bottom-6 left-1/3 opacity-40 rotate-[6deg]" />
      <FaPenFancy className="text-[#fb923c] text-5xl absolute bottom-6 right-[5%] opacity-40 rotate-[12deg]" />
    </div>
  );
};

export default LoginIcons;
