import Image from "next/image";
import { ADMIN_LOGIN_MEDIA } from "@/lib/constants";

export function AdminLoginVisual() {
  return (
    <div className="admin-login__backdrop" aria-hidden="true">
      <Image
        src={ADMIN_LOGIN_MEDIA.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="admin-login__backdrop-image"
      />
      <div className="admin-login__backdrop-shade" />
    </div>
  );
}
