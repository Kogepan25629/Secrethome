import Link from 'next/link'
import css from './Header.module.scss'

const Header = () => {
  return (
    <div className={css.header}>
      <Link href="/park/contents">
        <div className={css.header_logo}>Secret Home</div>
      </Link>
      <Link href="/park/admin/add_content">
        <button>追加</button>
      </Link>
    </div>
  )
}

export default Header
