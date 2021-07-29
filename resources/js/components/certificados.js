import {cer, key} from '@signati/openssl';
// import * as path from 'path';

const keyPem = await key.getKey("laravel-react-js/storage/app/private/CSD_MATRIZ_IACC820825ME3_20181026_090242.key", password);
const certi = cer.getCer("laravel-react-js/storage/app/private/00001000000412514186.cer");


