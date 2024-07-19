# face-demo

人脸识别的demo

https://github.com/vladmandic/face-api


https://github.com/vladmandic/face-api/blob/master/TUTORIAL.md#getting-started-face-detection-options


## face-detection-models
https://github.com/vladmandic/face-api/blob/master/TUTORIAL.md#face-detection-models

* SSD Mobilenet V1
* Tiny Face Detector


### SSD Mobilenet V1
For face detection, this project implements a SSD (Single Shot Multibox Detector) based on MobileNetV1. The neural net will compute the locations of each face in an image and will return the bounding boxes together with it's probability for each face. This face detector is aiming towards obtaining high accuracy in detecting face bounding boxes instead of low inference time. The size of the quantized model is about 5.4 MB (ssd_mobilenetv1_model).

对于人脸检测，该项目实现了基于MobileNetV1的SSD（Single Shot Multibox Detector）。神经网络将计算图像中每张脸的位置，并返回边界框以及每张脸的概率。该人脸检测器的目标是在检测人脸边界框时获得高精度，而不是低推理时间。量化模型的大小约为 5.4 MB (ssd_mobilenetv1_model)。



### Tiny Face Detector
The Tiny Face Detector is a very performant, realtime face detector, which is much faster, smaller and less resource consuming compared to the SSD Mobilenet V1 face detector, in return it performs slightly less well on detecting small faces. This model is extremely mobile and web friendly, thus it should be your GO-TO face detector on mobile devices and resource limited clients. The size of the quantized model is only 190 KB (tiny_face_detector_model).

Tiny Face Detector 是一款性能非常出色的实时人脸检测器，与 SSD Mobilenet V1 人脸检测器相比，速度更快、体积更小且资源消耗更少，但它在检测小人脸方面的表现稍差。该模型非常适合移动和网络友好，因此它应该是移动设备和资源有限的客户端上的首选人脸检测器。量化模型的大小仅为 190 KB (tiny_face_ detector_model)。
