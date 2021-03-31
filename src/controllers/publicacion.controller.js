
const User = require('../models/user.model');
const publicacion = require('../models/publicacion.model');
const comment = require('../models/comment.model');
const cloudinary = require('cloudinary').v2;
//const cloudinary = require('../helpers/cloudinary');

const fs = require('fs-extra');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



const publicacioncontroller = {};
/**
 * 
 * @param {Confirmation code headers front-end} auth 
 * @returns 
 */
async function userAuth(auth) {
    let confirmationCode = auth.replace(/['"']+/g, "");

    const user = await User.findOne({ confirmationCode: confirmationCode });
    console.log("Usuario: " + user)
    return user;
}



publicacioncontroller.createPublicacion = async (req, res) => {
    const files = req.files;
    let paths = [];
    let author = await userAuth(req.body.auth);


    const body = req.body.bodypublication;

    if (files !== undefined) {
        files.forEach(file => {
            paths.push(file.path);
        });
    }
    
    const newPublicacion = new publicacion();

    newPublicacion.body = body;
    newPublicacion.author = author._id;
 

  console.log(url);
    if (files !== undefined) {
        let contador = 0;
        paths.forEach(file => {
            // in clooud its create a user folder with your id and their pictures in publications 
            cloudinary.uploader.upload(file, { folder: `${author._id}/images` }, (err, result) => {
                newPublicacion.image.push({ url: result.url });
                console.log(file);
                console.log(result.url + " + " + contador);
                if (contador == paths.length) {

                    newPublicacion.save().then(result => {

                        console.log(result.image);

                    }).catch(err => console.log(err));

                }
            })
            contador++;
        })

        paths.forEach(async file => {
            await fs.unlink(file);
        })

        return res.status(200).send({ publication: newPublicacion });

    } else {

        return res.status(200).send({ publication: newPublicacion });
    }


}

// publicacioncontroller.getpublications = async (req, res) => {
//     res.redirect('/index');

// }
publicacioncontroller.getmypublications = async (req, res) => {
    const update = await publicacion.findById({ id: req.params._id });
    console.log(update);
    res.json(update);

}
publicacioncontroller.updatePublication = async (req, res) => {
    console.log("EASD");
    const body = req.body.cuerpo;
    console.log(body);
    const update = await publicacion.findOneAndUpdate(req.params.id, { body: body });
    console.log(update);
    res.redirect('/index');
}

publicacioncontroller.deletePublication = async (req, res) => {
    const publication = await publicacion.findById(req.params.id);
    console.log(publication.author);

    console.log(req.user.id);
    if (publication.author == req.user.id) {

        await publicacion.findByIdAndDelete(req.params.id);

        res.redirect('/index');
    }
}


publicacioncontroller.likePublication = async (req, res) => {
    console.log(req.params.idpublicacion);
    publicacion.findById(req.params.idpublicacion, (err, publicacion) => {


        if (publicacion.likes) {
            let likes = publicacion.likes.find(likes => {
                let id = likes.user_like;
                return id.equals(req.user.id);

            });
            if (likes) {
                console.log(publicacion.likes.pop({ user_like: req.user.id }));
                publicacion.save(function (err) {
                    req.flash(err);
                });

                res.redirect('/index');

            } else {
                publicacion.likes.push({ user_like: req.user.id });
                publicacion.save(function (err) {
                    req.flash(err);
                });
                res.redirect('/index')

            }
        } else {
            publicacion.likes.push({ user_like: req.user.id });
            publicacion.save(function (err) {
                req.flash(err);
                res.redirect('/index');
            })
        }

    });
}
/**
 */

publicacioncontroller.commentPublication = async (req, res) => {

    const newComment = new comment({
        author: req.params.iduser,
        bodyComment: req.body.comment
    });

    await newComment.save();


    if (newComment) {
        const comment = await publicacion.findByIdAndUpdate(req.params.idpublicacion, {
            $push: { comments: { comment: newComment.id } }
        }).populate('comments.comment');
        console.log(comment.comments);
        res.json(comment.comments);
    }



}

publicacioncontroller.editComment = async (req, res) => {

    const comments = await comment.findById(req.params.idcomment);

    if (comments.author.equals(req.params.iduser)) {
        comments.bodyComment = req.body.comment;
        comments.updateAt = new Date();
        let updateresult = await comments.save();
        //    let updateresult = comments.updateOne({

        //         bodyComment: req.body.comment ,
        //         updateAt: new Date()

        //     }, (err, result)=>{
        //             return result;

        //     }); 

        console.log(updateresult);
        res.json(updateresult);

    } else {
        console.log("no entro");
    }

    // console.log(iscomment);
    // res.json(iscomment)

}

const addImages = async (author, files) => {
    let urls = [];
    if (files !== undefined) {
        let contador = 0;
        files.forEach(file => {
            // in clooud its create a user folder with your id and their pictures in publications 
             (cloudinary.uploader.upload(file, { folder: `${author._id}/images` }, (err, result) => {
                 console.log( result)
                urls.push( result);
                return result;

            })
        )})
    }

    return urls;

}


module.exports = publicacioncontroller;


