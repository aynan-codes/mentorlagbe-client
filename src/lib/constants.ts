// export const API_ENDPOINTS = {
//   AUTH: {
//     TOKEN: "/auth/token",
//   },

//   TUITIONS: {
//     BASE: "/tuitions",
//     DETAILS: (id: string) => `/tuitions/${id}`,
//     FEATURED: "/tuitions/featured",
//   },

//   APPLICATIONS: {
//     BASE: "/applications",
//     CREATE: "/applications",
//     MY_APPLICATIONS: "/applications/my-applications",
//     CANCEL: (id: string) => `/applications/${id}`,
//   },
// };

// export const TUITION_CONFIG = {
//   FEATURED_LIMIT: 6,
//   EXPLORE_LIMIT: 12,
//   TOTAL_TUITIONS: 50,
// };





export const API_ENDPOINTS = {
  AUTH: {
    TOKEN: "/auth/token",
  },

  TUITIONS: {
    BASE: "/tuitions",
    DETAILS: (id: string) => `/tuitions/${id}`,
    FEATURED: "/tuitions/featured",
  },

  APPLICATIONS: {
    BASE: "/applications",
    CREATE: "/applications",
    MY_APPLICATIONS: "/applications/my-applications",
    TUTOR_APPLICATIONS: "/applications/tutor-applications",
    UPDATE_STATUS: (id: string) => `/applications/${id}/status`,
    CANCEL: (id: string) => `/applications/${id}`,
  },
};

export const TUITION_CONFIG = {
  FEATURED_LIMIT: 6,
  EXPLORE_LIMIT: 12,
  TOTAL_TUITIONS: 50,
};