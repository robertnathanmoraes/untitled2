// const path = require('path');
// const fs = require('fs');
// const express = require('express');
// const cors = require('cors');
// const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
// const ffmpeg = require('fluent-ffmpeg');
//
// const app = express();
// const httpPort = 1234;
// // Lista de URLs das streams
// const streamUrls = [
//     'rtsp://admin:Evone7464@@192.168.0.49:80/cam/realmonitor?channel=5&subtype=0',
//     'rtsp://admin:Evone7464@@192.168.0.49:80/cam/realmonitor?channel=1&subtype=0',
//     'rtsp://admin:Evone7464@@192.168.0.49:80/cam/realmonitor?channel=2&subtype=0',
//     'rtsp://admin:Evone7464@@192.168.0.49:80/cam/realmonitor?channel=3&subtype=0',
//     'rtsp://admin:Evone7464@@192.168.0.49:80/cam/realmonitor?channel=4&subtype=0',
//     // Adicione mais URLs de streams conforme necessário
// ];
//
// const publicDir = path.join(__dirname, 'publicDir');
// const outputDirectory = path.join(publicDir, 'stream');
//
// app.use(cors());
//
// if (!fs.existsSync(publicDir)) {
//     fs.mkdirSync(publicDir, { recursive: true });
// }
//
// if (!fs.existsSync(outputDirectory)) {
//     fs.mkdirSync(outputDirectory);
// }
//
// ffmpeg.setFfmpegPath(ffmpegInstaller.path);
//
// // Função para iniciar a conversão das streams
// function startStreamConversion() {
//     streamUrls.forEach((streamUrl, index) => {
//         const outputPlaylist = path.join(outputDirectory, `index${index}.m3u8`);
//         const outputSegment = path.join(outputDirectory, `stream${index}_%d.ts`);
//
//         ffmpeg(streamUrl)
//             .inputOptions('-rtsp_transport', 'tcp')
//             .inputOptions('-vsync', '0')
//             .inputOptions('-copyts')
//             .inputOptions('-an')
//             .outputOptions('-hls_flags', 'delete_segments+append_list')
//             .outputOptions('-f', 'hls')
//             .outputOptions('-hls_time', '0')
//             .outputOptions('-hls_list_size', '2')
//             .outputOptions('-hls_segment_type', 'mpegts')
//             .outputOptions('-hls_segment_filename', outputSegment)
//             .outputOptions('-x264opts', 'keyint=10')  // Definir a opção keyint para 15
//             .output(outputPlaylist)
//             .on('start', () => {
//                 console.log(`Conversão da stream ${index} iniciada`);
//             })
//             .on('progress', (progress) => {
//                 console.log(`Progresso da stream ${index}: ${progress.percent}%`);
//             })
//             .on('end', () => {
//                 console.log(`Conversão da stream ${index} concluída com sucesso!`);
//             })
//             .on('error', (err) => {
//                 console.error(`Erro ao converter stream ${index}:`, err);
//             })
//             .run();
//     });
// }
//
// // Iniciar a conversão das streams
// startStreamConversion();
//
// app.use(express.static(publicDir));
//
// app.listen(httpPort, () => {
//     console.log(`Servidor está executando na porta ${httpPort}`);
// });
const express = require('express');
const axios = require('axios');


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const indexPage = `
    <h3>Hello from a Node.js Application running on AWS ECS Fargate</h3>
    <p>What would you like to see?</p>
    <ul>
        <li>Random dogs? <a href="/dogs">Click here</a></li>
        <li>Random cats? <a href="/cats">Click here</a></li>
        <li>Create tables on AWS RDS <a href="/create-tables">Click here</a></li>
        <li>Check my todo list <a href="/todos">Click here</a></li>
    </ul>
`;

app.get('/', (req, res) => res.send(indexPage));
app.get('/healthcheck', (req, res) => {
    try {
        res.sendStatus(204);
    } catch (error) {
        res.sendStatus(500);
    }
});

app.get('/dogs', async (req, res) => {
    try {
        const response = await axios.get('https://dog.ceo/api/breeds/image/random');

        console.log(JSON.stringify(response.data));

        const { message: dogImage } = response.data;
        res.send(
            `<img src="${dogImage}" alt="random dog" style="max-width: 500px" />`
        );
    } catch (error) {
        console.error(JSON.stringify(error));
        res.status(500);
        res.send(error.message);
    }
});

app.get('/cats', async (req, res) => {
    try {
        const response = await axios.get('https://aws.random.cat/meow');

        console.log(JSON.stringify(response.data));

        const { file: catImage } = response.data;
        res.send(
            `<img src="${catImage}" alt="random cat" style="max-width: 500px" />`
        );
    } catch (error) {
        console.error(JSON.stringify(error));
        res.status(500);
        res.send(error.message);
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});