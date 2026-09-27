export function deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;
  
    if (
      typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null
    ) {
      return false;
    }
  
    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
  
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!deepEqual(obj1[key], obj2[key])) return false;
    }
  
    return true;
  }
  
  export function isItemListChanged(array1: any[], array2: any[]): boolean {
    if (!Array.isArray(array1) || !Array.isArray(array2)) return true;
    if (array1.length !== array2.length) return true;
  
    for (let i = 0; i < array1.length; i++) {
      const item1 = array1[i];
      const item2 = array2[i];
  
      const cb1 = item1?.custom_branding || [];
      const cb2 = item2?.custom_branding || [];
  
      const { custom_branding: _, ...rest1 } = item1;
      const { custom_branding: __, ...rest2 } = item2;
  
      // 1. Compare item-level data
      if (!deepEqual(rest1, rest2)) {
        console.log(`Item-level difference at index ${i}`);
        return true;
      }
  
      // 2. Compare custom_branding arrays
      if (!Array.isArray(cb1) || !Array.isArray(cb2)) return true;
      if (cb1.length !== cb2.length) return true;
  
      for (let j = 0; j < cb1.length; j++) {
        const brand1 = cb1[j] || {};
        const brand2 = cb2[j] || {};
  
        const branding1 = brand1?.branding_data || {};
        const branding2 = brand2?.branding_data || {};
  
        const custom1 = brand1?.customisation_data || [];
        const custom2 = brand2?.customisation_data || [];
  
        // 2a. Compare branding_data
        if (!deepEqual(branding1, branding2)) {
          console.log(`branding_data difference at item ${i}, branding ${j}`);
          return true;
        }
  
        // 2b. Compare customisation_data arrays
        if (!deepEqual(custom1, custom2)) {
          console.log(`customisation_data difference at item ${i}, branding ${j}`);
          return true;
        }
      }
    }
  
    return false;
  }
  