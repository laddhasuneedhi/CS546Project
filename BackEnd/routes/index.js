
import loginRoutes from "./login.js"
import privateRoutes from "./private.js"
import profileRoutes from "./profile.js"
import postRoutes from "./posts.js"
import searchRoutes from "./search.js"
const constructorMethod = (app) => {
    app.use("/", loginRoutes)
    app.use("/profile", profileRoutes )
    app.use("/posts", postRoutes )
    app.use("/search", searchRoutes)

    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not found'});
      });
}

export default constructorMethod