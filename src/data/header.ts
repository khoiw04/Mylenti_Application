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

export const initialNotifications = [
  {
    id: 1,
    user: "Chris Tompson",
    action: "requested review on",
    target: "PR #42: Feature implementation",
    timestamp: "15 minutes ago",
    unread: true,
  },
  {
    id: 2,
    user: "Emma Davis",
    action: "shared",
    target: "New component library",
    timestamp: "45 minutes ago",
    unread: true,
  },
  {
    id: 3,
    user: "James Wilson",
    action: "assigned you to",
    target: "API integration task",
    timestamp: "4 hours ago",
    unread: false,
  },
  {
    id: 4,
    user: "Alex Morgan",
    action: "replied to your comment in",
    target: "Authentication flow",
    timestamp: "12 hours ago",
    unread: false,
  },
  {
    id: 5,
    user: "Sarah Chen",
    action: "commented on",
    target: "Dashboard redesign",
    timestamp: "2 days ago",
    unread: false,
  },
  {
    id: 6,
    user: "Miky Derya",
    action: "mentioned you in",
    target: "Origin UI open graph image",
    timestamp: "2 weeks ago",
    unread: false,
  },
]