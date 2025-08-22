
const filledStar = (
  <svg xmlns="http://www.w3.org/2000/svg" 
       viewBox="0 0 24 24" 
       fill="gold" 
       width="20" 
       stroke="gold" 
       strokeWidth="2" 
       height="20">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 
             9.24l-7.19-.61L12 2 9.19 8.63 
             2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const emptyStar = (
  <svg xmlns="http://www.w3.org/2000/svg" 
       viewBox="0 0 24 24" 
       fill="none" 
       stroke="gray" 
       strokeWidth="2" 
       width="20" 
       height="20">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 
             9.24l-7.19-.61L12 2 9.19 8.63 
             2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const starRating = ({rating}) => {
  return (
      <div className="flex">
         {[...Array(5)].map((_, i) => (
         <span key={i}>
            {i < rating ? filledStar : emptyStar}
         </span>
         ))}
      </div>
  )
}

export default starRating