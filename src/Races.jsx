import React from 'react'

export default function Races() {
  const URL = "http://ergast.com/api/f1/current"
  fetch(URL+".json")
  .then(
    (result) => {
      return result.json()
    }
  )
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err)
  })
  return (
    <div>Races</div>
  )
}
