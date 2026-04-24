/****************************************************************************
** Meta object code from reading C++ file 'filteredspawnlog.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/filteredspawnlog.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'filteredspawnlog.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_FilteredSpawnLog_t {
    QByteArrayData data[10];
    char stringdata0[87];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_FilteredSpawnLog_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_FilteredSpawnLog_t qt_meta_stringdata_FilteredSpawnLog = {
    {
QT_MOC_LITERAL(0, 0, 16), // "FilteredSpawnLog"
QT_MOC_LITERAL(1, 17, 10), // "setFilters"
QT_MOC_LITERAL(2, 28, 0), // ""
QT_MOC_LITERAL(3, 29, 8), // "uint32_t"
QT_MOC_LITERAL(4, 38, 5), // "flags"
QT_MOC_LITERAL(5, 44, 7), // "addItem"
QT_MOC_LITERAL(6, 52, 11), // "const Item*"
QT_MOC_LITERAL(7, 64, 4), // "item"
QT_MOC_LITERAL(8, 69, 7), // "delItem"
QT_MOC_LITERAL(9, 77, 9) // "killSpawn"

    },
    "FilteredSpawnLog\0setFilters\0\0uint32_t\0"
    "flags\0addItem\0const Item*\0item\0delItem\0"
    "killSpawn"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_FilteredSpawnLog[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       4,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    1,   34,    2, 0x0a /* Public */,
       5,    1,   37,    2, 0x0a /* Public */,
       8,    1,   40,    2, 0x0a /* Public */,
       9,    1,   43,    2, 0x0a /* Public */,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 3,    4,
    QMetaType::Void, 0x80000000 | 6,    7,
    QMetaType::Void, 0x80000000 | 6,    7,
    QMetaType::Void, 0x80000000 | 6,    7,

       0        // eod
};

void FilteredSpawnLog::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<FilteredSpawnLog *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->setFilters((*reinterpret_cast< uint32_t(*)>(_a[1]))); break;
        case 1: _t->addItem((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 2: _t->delItem((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 3: _t->killSpawn((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        default: ;
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject FilteredSpawnLog::staticMetaObject = { {
    QMetaObject::SuperData::link<SEQLogger::staticMetaObject>(),
    qt_meta_stringdata_FilteredSpawnLog.data,
    qt_meta_data_FilteredSpawnLog,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *FilteredSpawnLog::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *FilteredSpawnLog::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_FilteredSpawnLog.stringdata0))
        return static_cast<void*>(this);
    return SEQLogger::qt_metacast(_clname);
}

int FilteredSpawnLog::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = SEQLogger::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 4)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 4;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 4)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 4;
    }
    return _id;
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
