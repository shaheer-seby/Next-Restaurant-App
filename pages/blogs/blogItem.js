// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import axios from 'axios';
// import moment from 'moment';
// import ReactPaginate from 'react-paginate';

// const BlogItem = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [itemOffset, setItemOffset] = useState(0);
//   const itemsPerPage = 12;

// //   useEffect(() => {
// //     const fetchBlogs = async () => {
// //       try {
// //         const { data } = await axios.get('http://localhost:1000/api/admin/blogs');
// //         setBlogs(data);
// //       } catch (err) {
// //         console.error('Error fetching blogs:', err);
// //       }
// //     };
// //     fetchBlogs();
// //   }, []);

//   const endOffset = itemOffset + itemsPerPage;
//   const currentItems = blogs.slice(itemOffset, endOffset);
//   const pageCount = Math.ceil(blogs.length / itemsPerPage);

//   const handlePageClick = (event) => {
//     const newOffset = (event.selected * itemsPerPage) % blogs.length;
//     setItemOffset(newOffset);

//     if (typeof window !== 'undefined') {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   return (
//     <>
//       <div className="grid-3">
//         {currentItems.length === 0 ? (
//           <h3 className="text-center">No items found!</h3>
//         ) : (
//           currentItems.map((item) => (
//             <div className="items shadow" key={item._id}>
//               <div className="img">
//                 <img src={`//${item.thumb}`} alt={item.title} />
//               </div>
//               <div className="text">
//                 <div className="admin flexSB">
//                   <span>
//                     <i className="fa fa-user"></i>
//                     <label>{item.post_by}</label>
//                   </span>
//                   <span>
//                     <i className="fa fa-calendar-alt"></i>
//                     <label>{moment(item.date).format('lll')}</label>
//                   </span>
//                 </div>
//                 <Link href={`/blog/${item._id}`} className="blog-title">
//                   <h1>{item.title.slice(0, 60)}...</h1>
//                 </Link>
//                 <p>
//                   {item.description.slice(0, 100)}...{' '}
//                   <Link href={`/blog/${item._id}`} className="success-btn">
//                     <i className="fas fa-eye"></i> Read More
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {blogs.length >= 13 && (
//         <div className="mt-4 d-flex justify-content-center">
//           <ReactPaginate
//             breakLabel="..."
//             nextLabel=">>"
//             onPageChange={handlePageClick}
//             pageRangeDisplayed={3}
//             pageCount={pageCount}
//             previousLabel="<<"
//             containerClassName="pagination"
//             pageClassName="page-item"
//             pageLinkClassName="page-link"
//             activeClassName="active"
//             previousClassName="page-item"
//             nextClassName="page-item"
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default BlogItem;
