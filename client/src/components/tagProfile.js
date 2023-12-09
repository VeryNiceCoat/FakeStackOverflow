import React from "react";

/**
 * Tag for the tag page
 */
const TagProfile = ({ tag, tagUserProfileClick}) => { 
    return (
      <button className='tagCard' onClick={tagUserProfileClick}>
        <div className='tagName'>{tag.name}</div>
      </button>
    )
  }
  
  export default TagProfile