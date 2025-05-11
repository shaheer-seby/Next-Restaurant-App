function IndexPage() {
  //const { canceled } = await searchParams

  // if (canceled) {
  //   console.log(
  //     'Order canceled -- continue to shop around and checkout when you’re ready.'
  //   )
  // }
  async function runlink()
    {
    console.log('GONE')
    const res = await fetch('/api/checkout_sessions', { method: 'POST' });
    const data = await res.json();
    window.location.href = data.url;
    console.log(data.url)
    }

  return (
  
        <button onClick={runlink}>
          Checkout
        </button>
  )
}
export default IndexPage;