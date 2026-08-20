import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`==============================================`);
  console.log(` YNR HAPPY HOMES REST API SERVER IS RUNNING`);
  console.log(` Environment: ${config.nodeEnv}`);
  console.log(` Port       : ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}${config.apiPrefix}/health`);
  console.log(`==============================================`);
});
