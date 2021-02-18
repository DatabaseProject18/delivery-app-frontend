import jwtDecode from "jwt-decode";

export const isLogin = () => {
  const token = localStorage.getItem("scms-auth-token");
  if (token) {
    const user = jwtDecode(token);
    if (
      user.user_id &&
      user.first_name &&
      user.user_type &&
      user[`${user.user_type}_id`]
    ) {
      return user;
    }
  }
  return false;
};
