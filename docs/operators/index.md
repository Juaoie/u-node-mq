# ð¨ operators

    Queueç±»æä¾çé©å­å½æ°å¯ä»¥éæoperatorså¯¹æ¶æ¯åæ¶è´¹èè¿è¡æä½ï¼

- [map](./map.md)
- [task](./task.md)
- [debounceTime](./debounceTime.md)
- [throttleTime](./throttleTime.md)
- [newsTime](./newsTime.md)
- [of](./of.md)
- [interval](./interval.md)
- [filter](./filter.md)
- [removeDuplicates](./removeDuplicates.md)
- [instant](./instant.md)

**operators å¼æ­¥é©å­å½æ°è¯´æ**

    å¼æ­¥é©å­å½æ°ä¸ä¼å½±åéåæ§è¡

| åç§°            | åæ°       | è¿å    | è¯´æ                     |
| --------------- | ---------- | ------- | ------------------------ |
| mounted         | Queue      | unknown | operate å®è£æåä»¥åæ§è¡ |
| addedNews       | News       | unknown | æ¶æ¯å å¥éåä»¥åæ§è¡     |
| addedConsumer   | Consumer   | unknown | æ¶è´¹èè®¢ééåä»¥åæ§è¡   |
| removedConsumer | Consumer[] | unknown | æ¶è´¹èæåè¢«ç§»é¤ä»¥åæ§è¡ |

**operators åæ­¥é©å­å½æ°è¯´æ**

    åæ­¥çé©å­å½æ°è¿åå¼ä¼å½±åéåæ§è¡

| åç§°          | åæ° | è¿å                        | è¯´æ                                             |
| ------------- | ---- | --------------------------- | ------------------------------------------------ |
| beforeAddNews | News | boolean \| Promise<boolean> | æ¶æ¯å å¥éåä¹åæ§è¡ï¼éè¿è¿åå¼æ§å¶æ¯å¦å å¥éå |
| ejectNews     | News | boolean \| Promise<boolean> | æ¶æ¯å¼¹åºæ¥ä»¥åæ§è¡ï¼è¿åå¼ç¨äºæ§å¶æ¶æ¯æ¯å¦è¢«ä¸¢å¼ |
