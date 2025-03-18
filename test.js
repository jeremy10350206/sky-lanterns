<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D 天燈網站</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>
        body { margin: 0; overflow: hidden; background: #000; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script>
        // 初始化 Three.js 場景
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // 天燈材質
        const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: false });
        
        // 建立多個天燈
        const lanterns = [];
        for (let i = 0; i < 10; i++) {
            const lantern = new THREE.Mesh(geometry, material);
            lantern.position.set(Math.random() * 10 - 5, Math.random() * 5 - 2, Math.random() * 10 - 5);
            scene.add(lantern);
            lanterns.push(lantern);
        }

        camera.position.z = 10;

        // 動畫讓天燈上升
        lanterns.forEach(lantern => {
            gsap.to(lantern.position, {
                y: "+=10", // 向上移動
                duration: Math.random() * 5 + 5, // 隨機速度
                repeat: -1, // 無限循環
                yoyo: false, // 不來回
                ease: "linear"
            });
        });

        // 渲染場景
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        // 自適應螢幕大小
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    </script>
</body>
</html>
