import React from 'react';
import { useRouter } from 'next/router';
import Banner from '@/styles/banner/Banner';
const CategoryDetailPage = ({ category, items }) => {
  const router = useRouter();

  if (!category) {
    return (
      <h2 style={{ textAlign: "center", padding: "60px 0", color: "#dc3545", fontSize: "1.8rem" }}>
        Category not found
      </h2>
    );
  }

  const handleClick = (id) => {
    router.push(`/food/${id}`);
  };

  return (

    <div style={{
      background: "linear-gradient(to bottom right, #fef9f4, #ffffff)",
      paddingBottom: "80px",
      paddingLeft: "20px",
      paddingRight: "20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <Banner title='Welcome' subtitle='To the Delicious cuisine' />

      <h2 style={{
        textAlign: "center",
        marginBottom: "60px",
        fontSize: "2.8rem",
        fontWeight: "700",
        color: "#2c3e50"
      }}>
        {category}
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "40px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {items.map((item) => (
          <div
            key={item._id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              paddingBottom: "10px"
            }}
            onClick={() => handleClick(item._id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.1)";
            }}
          >
            <img
  src={`/uploads/foods/${item.thumb}` || 'https://via.placeholder.com/400x250'}

              alt={item.title}
              style={{
                width: "100%",
                height: "230px",
                objectFit: "cover"
              }}
            />
            <div style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between"
            }}>
              <h5 style={{
                marginBottom: "10px",
                fontSize: "1.2rem",
                color: "#34495e"
              }}>
                {item.title}
              </h5>
              <p style={{
                color: "#7f8c8d",
                fontSize: "0.9rem",
                marginBottom: "15px",
                flexGrow: 1
              }}>
                {item.description}
              </p>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto"
              }}>
                <span style={{ fontWeight: "bold", color: "#27ae60" }}>
                  Rs. {item.price}
                </span>
                <span style={{
                  backgroundColor: "#f1c40f",
                  color: "#2c3e50",
                  padding: "6px 12px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "0.85rem"
                }}>
                  {item.rating} ⭐ ({item.totalReviews})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { title } = context.params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/foods/ByTitle/${title}`);

  if (!res.ok) {
    return { props: { category: null, items: [] } };
  }

  const data = await res.json();

  return {
    props: {
      category: data.category || null,
      items: data.items || [],
    },
  };
}

export default CategoryDetailPage;
