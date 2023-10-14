import React from 'react'
import Branches from '../../../modules/settings/branches'
import axios from 'axios'

const BranchesPage = ({ branches }) => <Branches />

export default BranchesPage

export const getServerSideProps = async ({ query, locale = 'ar' }) => {
  let getBranches = []
  try {
    const { data: { data } } = await axios(`${process.env.REACT_APP_API_URL}/GetListBranche?lang=${locale}`)
    getBranches = data
  
  }
  catch (error) {
    console.error({ error }, 'getBranches query')
  }

  finally {
    return {
      props: {
        branches: getBranches
      }
    }
  }
}