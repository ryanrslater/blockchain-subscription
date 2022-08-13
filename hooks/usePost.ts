import React from "react";
import { useRouter } from "next/router";
const usePost = (url: string) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const router = useRouter();
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const newPost = async (body: any) => {
    setError("");
    setLoading(true);
    setSuccess(false);
    try {
      const data = await fetch(url, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
        redirect: "follow",
      });
      const response = await data.json();
      if (response.error) {
        setError(response.error);
      }
      if (response.res === "success") {
        setSuccess(true);
        router.replace(router.asPath);
        return response.res;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return { loading, success, error, newPost };
};

export default usePost;
