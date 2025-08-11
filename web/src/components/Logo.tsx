import logo from '../assets/logo.svg'

export default function Logo() {
  return (
    <div className="flex items-start md:text-left text-center justify-start mb-4 md:w-3/4 w-auto mt-4 md:p-2 p-0">
        <img src={logo}  alt="Brev.ly Logo" className="h-7 w-auto" />
    </div>
  )
}