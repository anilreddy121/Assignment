import { API_URL } from "./constants";

export const httpClient = async (url, type, obj, isLocalUrl = false) => {
    try {
        type = type.toUpperCase();
        if (type.toLowerCase() === "get" && obj) {
            var params = Object.keys(obj)
                .map(function (key) {
                    return key + "=" + obj[key];
                })
                .join("&");
            url += "?" + params;
            obj = undefined;
        }
        let apiUrl = API_URL;
        if (isLocalUrl) {
            apiUrl = ""
        }
        let res = await fetch(apiUrl + url, {
            method: type.toUpperCase(),
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        });
        return await res.json();
    } catch (error) {
        console.group(`API ${type} Error`);
        console.error(error);
        console.groupEnd();
        throw error;
    }
};
