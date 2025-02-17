import  multer from 'multer';
import path from 'path';
import fs from 'fs';



const storage = multer.diskStorage({
   
    filename: (req, file, cb)=>{
        
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
    },

    destination(req, file, cb) {
        let folder: string = '';

       if(req.baseUrl.includes('doctors')){
            folder = 'images';
        } 

        cb(null, `public/${folder}` );

    },
    
})

export const filesUpload = multer({
    storage: storage
});


// Delete file
// export const filePathDelete = path.join(__dirname, '/public/attachments');

// fs.unlink(filePathDelete, (err: any) => {
//     if (err) {
//         console.log(err.message);
//     } else{
//         console.log({error: false});
//     }
// })

