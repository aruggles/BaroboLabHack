/* On Windows, winnt.h (included from windows.h) defines a MemoryBarrier macro
 * or function. This identifier is also used in qopenglversionfunctions.h,
 * causing build failures with Qt version 5.2.0 (and presumably others). */

#ifndef QTBUGWORKAROUND_H
#define QTBUGWORKAROUND_H

#ifdef _WIN32

#include <windows.h>
#ifdef MemoryBarrier
#undef MemoryBarrier
#endif

#endif /* _WIN32 */

#endif
