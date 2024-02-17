import { useEffect, useRef, useState } from 'react'

interface HttpParam {
    url: string,
    apiUrl: string,
    params?: Object,
    body?: Object,
    token?: string,
}
type Message = {
    type: string;
    data: any;
};

type WebSocketOptions = {
    url: string;
    token: string;
    onOpen?: () => void;
    onClose?: (event: Event) => void;
    onError?: (event: Event) => void;
    onMessage?: (message: any) => void;
    reconnectInterval?: number;
    reconnectAttempts?: number;
};

const defaultOptions: Required<WebSocketOptions> = {
    url: '',//连接的长链接
    token: '',
    onOpen: () => { },//开启连接
    onClose: () => { },//关闭链接
    onError: () => { },//异常
    onMessage: () => { },//消息
    reconnectInterval: 5000,//重连时长设置
    reconnectAttempts: 5,//最大重连次数
};


const BACKEND = process.env.NEXT_PUBLIC_SERVER_URL
const LOCAL = process.env.NEXT_PUBLIC_NEXT_URL

const httpNormalActions = ({ url, apiUrl, params, body, token }: HttpParam) => {
    function paramsToString(params: Object) {
        if (!params) {
            return ''
        }
        const paramsArray = Object.keys(params).map(key => (key + '=' + params[key]))

        return '?' + paramsArray.join('&')
    }

    if (apiUrl) {
        apiUrl = LOCAL + '/api' + apiUrl
    }


    return new Promise((resolve, reject) => {
        const paramString = paramsToString(params)
        const actualUrl = apiUrl ? "http://" + apiUrl : "http://" + (!token ? LOCAL + '/api/proxy' : BACKEND) + url + paramString

        const header = !token ? {} : {
            'Authentication': token,
            'Content-Type': 'application/json',
        }

        const fetchConfig: RequestInit = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: header,
            credentials: (token ? 'omit' : 'include'),
        }

        fetch(actualUrl, fetchConfig)
            .then((res) => {
                if (res.ok) {
                    resolve(res.json())
                } else return Promise.reject(res)
            })
            .catch((res: Response) => {
                const { status } = res
                reject('code:' + status + ',连接服务器失败')
            })

    })
}


const useWebSocket = (
    options: WebSocketOptions,
): [WebSocket | undefined, (message: any) => void, string, boolean] => {
    const { url, token, onOpen, onClose, onError, onMessage, reconnectInterval, reconnectAttempts } = {
        ...defaultOptions,
        ...options,
    };

    const [isConnected, setIsConnected] = useState(false);//是否连接
    const [reconnectCount, setReconnectCount] = useState(0);//用于判断重连
    const [lastMessage, setLastMessage] = useState('');//最新的消息

    const socketRef = useRef<WebSocket>();
    const reconnectTimerRef = useRef<any>();

    const connect = () => {
        setIsConnected(false);

        const socket = new WebSocket("ws://" + BACKEND + url + '/' + token);
        socket.onopen = () => {
            console.log('WebSocket is connected');
            setIsConnected(true);

            setReconnectCount(0);
            onOpen();
        };
        socket.onclose = (event) => {
            console.error(`WebSocket closed with code ${event.code}`);
            setIsConnected(false);
            onClose(event);
            if (reconnectCount < reconnectAttempts) {
                //用于判断断开连接后重新连接
                reconnectTimerRef.current = setTimeout(() => {
                    setReconnectCount((prevCount) => prevCount + 1);
                    connect();
                }, reconnectInterval);
            }
        };
        socket.onerror = (event) => {
            console.error('WebSocket error:', event);
            onError(event);
            onClose(event);
        };
        socket.onmessage = (event) => {
            //接收到消息
            const message: any = event.data;
            setLastMessage(event.data);
            onMessage(message);
        };

        socketRef.current = socket;
    };

    useEffect(() => {
        if (token && !isConnected) connect();
        return () => {
            socketRef.current?.close();
            clearTimeout(reconnectTimerRef.current);
        };
    }, [token]);

    const sendMessage = (message: string) => {

        if (socketRef.current) {
            socketRef.current.send(message);
            return true
        } else {
            console.error('Cannot send message - WebSocket is not connected');
            return false
        }
    };

    return [socketRef.current, sendMessage, lastMessage, isConnected];
};

export { httpNormalActions, useWebSocket }