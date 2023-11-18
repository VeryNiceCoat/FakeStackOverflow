/**
 * This is meant to be one global variable
 * In the array elements of it, will be the search tags
 * Pass references of this to certain components and it will edit the class directly
 * After that, call the main page and it will only show that forms
 * Eg Say Query has string Text and array Tags
 * If someone clicks on a tag button, it will change the tags array 
 * Then pass the object to the main page showing component and it will correctly show what to represent
 */
export default class Query {
  /**
   * For search bar, only use Query.extractAndRemoveTags(input)
   * For tag buttons, directly edit the tag array by setting  this.data.text to undefined, along with hyperlink but this.data.tags to [tag]
   * @param {String From Search} input 
   * @returns 
   */
    extractAndRemoveTags(input) {
      this.data  = {
        text: undefined,
        tags: [],
        hyperlink: undefined,
      }
        const regex = /\[([^\]]+)\]/g; 
        const matches = input.match(regex); 
        if (!matches) {
          this.data.tags = [];
          this.data.text = input;
          return;
        }
        const tags = matches.map(match => match.slice(1, -1)); 
        const text = input.replace(regex, ''); 
        this.data.text = text;
        this.data.tags = tags;
        // return {tags,result,};
    }

    constructor() {
      this.data  = {
        text: undefined,
        tags: [],
        hyperlink: undefined,
      }
    }
}