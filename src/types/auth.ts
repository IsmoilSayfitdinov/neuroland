const Role = {
    ADMIN: "admin",
    PARENT: "parent",
    SPECIALIST: "specialist",
} as const;

type Role = (typeof Role)[keyof typeof Role];

export default Role;