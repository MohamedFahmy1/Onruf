import React from 'react'
import { businessId, ProviderId, token } from '../../../../token'
import SingleFolder from '../../../modules/products/folders/singleFolder'
import axios from 'axios'
import { useRouter } from 'next/router'

const GetSingleFolder = () => <SingleFolder />

export async function getServerSideProps(context) {
    return {
      props: {}, // will be passed to the page component as props
    };
  }

export default GetSingleFolder

