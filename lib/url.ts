import { useRouter } from "next/router";
import qs from "query-string";


interface UrlQueryParams {
    params: string;
    key: string;
    value: string;
}

interface RemoveUrlQueryParams {
    params: string;
    KeysToremove: string[];
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
    const queryString = qs.parse(params);
    queryString[key] = value;
    return qs.stringifyUrl({
        url: window.location.pathname,
        query: queryString,
    });
};

export const removeKeysFromUrlQuery = ({
    params,
    KeysToremove,
}: RemoveUrlQueryParams) => {
    const queryString = qs.parse(params);

    KeysToremove.forEach((key) => {
        delete queryString[key];
    })

    return qs.stringifyUrl({
        url: window.location.pathname,
        query: queryString,
    },{
        skipNull:true
    });
};

/*
const params = "page=2&category=shoes&tags=red&tags=blue";
const currentUrl = qs.parse(params);
console.log(currentUrl);


{
  page: "2",
  category: "shoes",
  tags: ["red", "blue"] // ✅ handles multiple values automatically
}


*/
