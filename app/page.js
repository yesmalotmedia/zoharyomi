import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaBookOpen, FaClock, FaInfoCircle } from "react-icons/fa";
import LastLessonCard from "@/components/LastLessonCard";
import SocialLinks from "@/components/SocialLinks";
import css from "./home.module.css";

// דף הבית מרונדר בשרת - התוכן נשלח מוכן ב-HTML, והאנימציה והתאמת המובייל
// נעשות ב-CSS בלבד (בלי לחכות ל-JavaScript כדי להציג משהו)
export default function HomePage() {
  const whatsappLink =
    process.env.NEXT_PUBLIC_WHATSAPP_LINK ||
    "https://chat.whatsapp.com/Jho0f5IWHZW3rFzWu5s1X9";

  return (
    <>
      {/* כרטיס השיעור האחרון – יוצג רק אם יש נתונים */}
      <LastLessonCard />
      <div className={css.hero}>
        <div className={css.centerBlock}>
          {/* לוגו + כותרת יחד */}
          <div className={`${css.fade} ${css.logoTitle}`}>
            <Image
              src="/zoharlogo.png"
              alt="לוגו"
              width={110}
              height={110}
              priority
              className={css.logo}
            />

            <h1 className={`${css.fade} ${css.title}`}>הלימוד היומי בזוהר</h1>
          </div>

          {/* תפריט */}
          <div className={`${css.fade} ${css.menu}`}>
            <MenuItem
              href="/shiur/iyun"
              icon={<FaBookOpen size={32} color="white" />}
              label="שיעורי עיון"
            />

            <MenuItem
              href="/shiur/pshat"
              icon={<FaClock size={32} color="white" />}
              label="שיעורי פשט"
            />

            <MenuItem
              href="/about"
              icon={<FaInfoCircle size={32} color="white" />}
              label="אודות"
            />
          </div>

          {/* וואטסאפ */}
          <div className={`${css.fade} ${css.whatsappWrapper}`}>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={css.whatsapp}
            >
              <FaWhatsapp size={26} style={{ marginLeft: 8 }} />
              הצטרפו ללימוד היומי
            </a>
          </div>
          <br />
          <SocialLinks />
        </div>
      </div>
    </>
  );
}

/* ========================= */
/*     קומפוננטת תפריט      */
/* ========================= */

function MenuItem({ href, icon, label }) {
  return (
    <Link href={href} className={css.menuItemWrapper}>
      <div className={css.menuIcon}>{icon}</div>
      <div className={css.menuItem}>{label}</div>
    </Link>
  );
}
