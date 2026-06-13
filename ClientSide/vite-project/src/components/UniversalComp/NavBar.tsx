import { Link, NavLink } from 'react-router-dom';
import Group from '../../assets/Group 1.png';
import Ellipse from '../../assets/Ellipse 1.png';

const NavBar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-[Poppins] font-medium text-[18px] leading-[100%] tracking-normal cursor-pointer transition-colors ${
      isActive ? 'text-[#974FD0]' : 'text-[#292929] hover:text-[#974FD0]'
    }`;

  return (
    <div className='h-23.25 border-b-[0.5px] border-[#B8B6B6] '>
      <div className='container mx-auto w-11/12 '>
        <div className='flex flex-row justify-between items-center pt-3'>
          <Link to='/' className='flex flex-row justify-center items-center gap-2 cursor-pointer'>
            <img className='w-[39.91px] h-[39.91px] ' src={Group} alt="TaskDuty logo" />
            <p className='font-[Poppins] font-bold text-[#2D0050] text-[28px] leading-[100%] tracking-normal '>
              TaskDuty
            </p>
          </Link>

          <div className='flex flex-row justify-center items-center gap-5'>
            <NavLink to='/new-task' className={linkClass}>
              New Task
            </NavLink>
            <NavLink to='/my-tasks' className={linkClass}>
              All Tasks
            </NavLink>

            <img
              className='w-15 h-15 border-[3px] border-[#292929] rounded-full'
              src={Ellipse}
              alt="User avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;