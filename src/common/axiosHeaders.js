import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const AxiosHeader =() => {

    const token = useSelector((state) => state.authSlice.token);
    const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId);
    const providerId = useSelector((state) => state.authSlice.providerId);

    const headersJson = {
        headers: {
          Authorization:token ,
         "Provider-Id":providerId,
          "Business-Account-Id": buisnessAccountId,
          "User-Language": "en",
        },
      }

return headersJson    

}