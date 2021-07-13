import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AsyncTest() {
  const [value, setValue] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3002/api'
        );
        setValue(JSON.stringify(res.data));
      } catch (e) {
        console.log(e);
      }
    };

    fetch();
  }, []);

  return (
    <div>
      <button onClick={fetch}>FETCH</button>
      <div>{value}</div>
    </div>
  )
}

export default AsyncTest;
