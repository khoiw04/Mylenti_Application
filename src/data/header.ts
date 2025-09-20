export const navigationLinks = [
  { href: "/", label: "Giao diện" },
  { href: "/obs-overlay", label: "OBS Cài đặt" },
] as const

export const searchGroups = [
  {
    heading: "Thông tin cá nhân",
    items: [
      { value: "Lý lịch", href: "/ly-lich" },
      { value: "Ngân hàng", href: "/ngan-hang" },
    ],
  },
  {
    heading: "Hệ thống",
    items: [
      { value: "Giao dịch / Thống kê", href: "/ke-toan" },
      { value: "Giao diện", href: "/" },
      { value: "OBS Overlay", href: "/obs-overlay" },
    ],
  },
] as const