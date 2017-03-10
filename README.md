## REACT NATIVE - SIDE PROJECT ##

## INSTALLATION ##

1. ```npm install```

### ANDROID
2. ```react-native run-android```

### IPHONE
2. ```react-native run-ios```

... A completer
...



## GIT

Create the branch on your local machine and switch in this branch
```git checkout -b feature/[name_of_your_new_branch]```

Push the branch on github :
```git push -u origin feature/[name_of_your_new_branch]```


App Digaram
https://docs.google.com/drawings/d/1Rcc-UFXhL88AssH0elXD59Twj_qaulpTgIGdAf7-Yxk/edit?usp=sharing

Which branch is selected in local
```git branch```

how to discard git local branch changes?
```git reset --hard```
or
```git checkout -f```


Commit changes in a new branch
```git add .```
```git commit -m <branch> ```
```git push -u origin <branch>```

## Generating the release APK

```cd android && ./gradlew assembleRelease```
https://facebook.github.io/react-native/docs/signed-apk-android.html
