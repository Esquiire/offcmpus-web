import React from 'react'
import {useHistory} from 'react-router-dom'

import ViewWrapper from '../components/ViewWrapper'
import Button from '../components/toolbox/form/Button'
import {Helmet} from "react-helmet";

import { FiHome } from "react-icons/fi"

const NotFound = () => {
  const history = useHistory()
  
  const goHome = () => history.push('/')

  return (<ViewWrapper>

   <Helmet>
        <meta charSet="utf-8" />
        <title>offcmpus | 404 Not Found</title>
    </Helmet>

    <div>
      <div
      style={{
        fontWeight: 600,
        fontSize: '8rem',
        textAlign: 'center',
        marginTop: '200px',
        color: `rgba(0, 0, 0, 0.4)`
      }}>
        404
      </div>
      <div
      style={{
        textAlign: 'center',
        fontSize: `1.5rem`
      }}
      >
        Page Not Found
        <div style={{
          width: '120px',
          margin: '0 auto',
          marginTop: '10px',
          fontSize: `0.8rem`
        }}>
          <Button 
            text="Go Home"
            textColor="white"
            onClick={goHome}
            transformDisabled={true}
            bold={true}
          />
        </div>
      </div>
    </div>
  </ViewWrapper>)
}

export default NotFound