const autoCompleteConfig={
    //How to show and what paramters to show as an individual item in the dropdown options
    renderOption:(movie)=>{
        const imgSrc=movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}">
        ${movie.Title} (${movie.Year})
        `;
    },
    inputValue:(movie)=>{
        return movie.Title;
    },
    //How to fetch the data from API and returning it
    async fetchData(searchTerm){
        const response=await axios.get('http://www.omdbapi.com/',{
    params:{
        apikey:'8bc0044a',
        s:searchTerm,
        }
    })
        if(response.data.Error){
        return [];
    }
        return response.data.Search;
    }
};

createAutoComplete({
    //code inside autocompleteconfig is common for all autocomplete widgets and hence we made a common copy of it inside other object
    ...autoCompleteConfig,
    //specify where to render the autocomplete by selecting an element from document
    root: document.querySelector('#left-autocomplete'),
    //What to do when someone clicks on one of the option item or outside it
    onOptionSelect:(movie)=>{
        document.querySelector('.tutorial').classList.add('is-hidden');
    movieDesc(movie,document.querySelector("#left-summary"),'left');
    },
  
});
createAutoComplete({
    //code inside autocompleteconfig is common for all autocomplete widgets and hence we made a common copy of it inside other object
    ...autoCompleteConfig,
    //specify where to render the autocomplete by selecting an element from document
    root: document.querySelector('#right-autocomplete'),
    //What to do when someone clicks on one of the option item or outside it
    onOptionSelect:(movie)=>{
        document.querySelector('.tutorial').classList.add('is-hidden');
    movieDesc(movie,document.querySelector("#right-summary"),'right');
    },
  
});

let leftMovie;
let rightMovie;
const movieDesc=async (movie,summaryElement,side)=>{
    const res=await axios.get('http://www.omdbapi.com/',{
        params:
        {
            apikey:'8bc0044a',
            i:movie.imdbID
        }
    });
   // console.log(res.data);
   
   if(side === 'left'){
       leftMovie=res.data;
       console.log(leftMovie);
   }
   else{
       rightMovie=res.data;    
       console.log(rightMovie);
   }
   
    summaryElement.innerHTML = movieTemplate(res.data);
    if(leftMovie && rightMovie){
        runComparison();
    }
    

};
const runComparison=()=>{
    const rightValueStats=document.querySelectorAll('#right-summary .notification');
    const leftValueStats=document.querySelectorAll('#left-summary .notification');
    
    leftValueStats.forEach((leftStats,index)=>{
        const rightStats=rightValueStats[index];
        const leftValue=parseInt(leftStats.dataset.value);
        const rightValue=parseInt(rightStats.dataset.value);
        if(rightValue>leftValue){
            // console.log(leftValue);
            // console.log(rightValue);
            leftStats.classList.remove('is-primary');
            leftStats.classList.add('is-warning');
        }
        else{
            // console.log(leftValue);
            // console.log(rightValue);
            rightStats.classList.remove('is-primary');
            rightStats.classList.add('is-warning');
        }

    });

    
    
};

const movieTemplate = movieDetail => {
    const score=parseInt(movieDetail.Metascore);
    const imdbrating=parseFloat(movieDetail.imdbRating);
    const imdbvotes=parseInt((movieDetail.imdbVotes).replace(/,/g,''));
   
    const awards=movieDetail.Awards.split(' ').reduce((prev,word) =>{
     const value=parseInt(word);
     if(isNaN(value)){
         return prev;
     } 
     else{
         return prev+value;
     }
    },0);
    console.log(awards,imdbvotes,imdbrating,score);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value="${awards}" class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards Won</p>
     </article>
     
     <article data-value="${score}" class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">MetaScore</p>
     </article>
     <article data-value="${imdbrating}" class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Ratings</p>
     </article>
    <article data-value="${imdbvotes}" class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
     `;
};