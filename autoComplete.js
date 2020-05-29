// This is an independent autoComplete widget which can be 

const createAutoComplete=({root,renderOption,onOptionSelect,inputValue,fetchData})=>{
    
        root.innerHTML=`
        <label><b>Search</b></label>
        <input class="input"/>
        <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
        </div>
        `;


const input=root.querySelector('input');
const dropdown=root.querySelector('.dropdown'); //to hide or show dropdown
const resultsWrapper=root.querySelector('.results'); //to bind together all the search results
// This piece of code will wait till the user enters all the input in search bar

const onInput=async (event)=>{
   const items=await fetchData(event.target.value);
   if(!(items.length)){
       dropdown.classList.remove('is-active');
       return;
   }
   resultsWrapper.innerHTML='';
   dropdown.classList.add('is-active');
   for (let item of items){
       const options=document.createElement('a');
       
       options.classList.add('dropdown-item');
       options.innerHTML=renderOption(item);
       options.addEventListener('click',()=>{
           dropdown.classList.remove('is-active');
           input.value=inputValue(item)    ;
           onOptionSelect(item);
       })
       resultsWrapper.appendChild(options);
   }
   }

input.addEventListener('input',debounce(onInput,500));

document.addEventListener('click',(event)=>{
    if(!(root.contains(event.target))){
        dropdown.classList.remove('is-active');
    }
})

}