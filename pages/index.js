// pages/index.js
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/auth',
      permanent: false, // Set to true if this is a permanent redirect
    },
  };
}

export default function Home() {
  return null; // This component won't be rendered due to the redirect
}
