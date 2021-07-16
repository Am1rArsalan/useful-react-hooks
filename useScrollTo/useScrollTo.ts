import { useEffect } from 'react' ; 

export function useScrollTo (ref,lRef,data) { 
  useEffect(() => {
    if (data?.length) {
      ref?.current?.scrollTo({
        behavior: "smooth",
        top: lRef?.current?.clientHeight,
      });
    }
  }, [data]);
}

