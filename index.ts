import express, {Request,Response,NextFunction} from 'express'
require('dotenv').config()
const app = express()
const port = process.env.PORT
import jwt, { JwtPayload } from 'jsonwebtoken';
const secret:any = process.env.SECRET;
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))


function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-access-token'] as string;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secret, (err:any, decoded:any) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        (req as any).userId = (decoded as any).userId;
        next();
    });
}


app.get('/',(req:Request,res:Response)=>{
    res.json({message:'Ola tudo certo'})
})
app.get('/clientes',verifyJWT,(req:Request,res:Response)=>{
    res.end('autenticado')      
    res.json({id:1, nome:'jhon'})
})
app.post('/login',(req:Request,res:Response)=>{
    if(req.body.user === 'jhon' && req.body.pass ==='2802'){
        
        const token = jwt.sign({userId:1},secret,{expiresIn:300})

        res.json({auth:true,token})
    }
    
})

app.listen(port,()=>{
    console.log(`rodando na porta ${port}`)
})